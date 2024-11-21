from flask import Flask, jsonify, request, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from keras.models import load_model
from keras.preprocessing import image
from keras.applications.resnet_v2 import preprocess_input
from keras.utils import custom_object_scope
from layers.custom_layers import CustomScaleLayer
import random
import numpy as np
import os
import tensorflow as tf
from PIL import Image
from flask_restx import Api, Resource
import string


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for requests from http://localhost:3000
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Secret key for session security
app.secret_key = os.getenv('SECRET_KEY')

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

# Initialize extensions
db = SQLAlchemy(app)
mail = Mail(app)

# Ensure upload directory exists
app.config['UPLOAD_FOLDER'] = 'upload'
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'bmp'}


# Define the User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_firstname = db.Column(db.String(255))
    user_lastname = db.Column(db.String(255))
    user_email = db.Column(db.String(255), unique=True)
    user_password = db.Column(db.String(255))
    user_membership = db.Column(db.Integer)
    user_otp = db.Column(db.Integer)


# Create database tables
with app.app_context():
    db.create_all()


# Helper Functions
def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def send_email(email, body):
    try:
        msg = Message('Hi', recipients=[email])
        msg.body = body
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")


def preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.convert('RGB')
    img = img.resize((224, 224))  # Resize image to (224, 224) as expected by the model
    img_array = np.array(img)

    # Expand dimensions to match the batch size
    img_array = np.expand_dims(img_array, axis=0)  # (1, 224, 224, 3)

    # Preprocess the image (standardize for ResNet)
    img_array = preprocess_input(img_array)

    # Return the image as a TensorFlow tensor
    return tf.convert_to_tensor(img_array, dtype=tf.float32)


def determine_cancerous(class_name):
    cancerous_classes = {
        'carcinoma_in_situ': True,
        'light_dysplastic': True,
        'moderate_dysplastic': True,
        'normal_columnar': False,
        'normal_intermediate': False,
        'normal_superficiel': False,
        'severe_dysplastic': True,
    }
    return cancerous_classes.get(class_name, None)


# Load models with custom layer handling
with custom_object_scope({'CustomScaleLayer': CustomScaleLayer}):
    models = [
        load_model('Model/ResNet50V2_model.h5', custom_objects={'CustomScaleLayer': CustomScaleLayer}),
        load_model('Model/ResNet101V2_model.h5', custom_objects={'CustomScaleLayer': CustomScaleLayer}),
        load_model('Model/DenseNet121_model.h5', custom_objects={'CustomScaleLayer': CustomScaleLayer}),
        load_model('Model/DenseNet169_model.h5', custom_objects={'CustomScaleLayer': CustomScaleLayer}),
        load_model('Model/InceptionResNetV2.h5', custom_objects={'CustomScaleLayer': CustomScaleLayer})
    ]

classes = ['carcinoma_in_situ', 'light_dysplastic', 'moderate_dysplastic',
           'normal_columnar', 'normal_intermediate', 'normal_superficiel', 'severe_dysplastic']


def predict_with_majority(models, img_tensor, threshold=0.8):
    predictions = [np.argmax(model.predict(img_tensor)) for model in models]

    # Majority voting logic to determine the predicted class
    majority_class_idx = np.argmax(np.bincount(predictions))
    majority_class_name = classes[majority_class_idx]

    # Determine if the predicted class is cancerous
    is_cancerous = determine_cancerous(majority_class_name)

    return {
        'prediction': majority_class_name,
        'is_cancerous': is_cancerous
    }


# Routes
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        user_firstname = data.get('FirstName')
        user_lastname = data.get('LastName')
        user_email = data.get('Email')
        user_password = data.get('Password')

        if not all([user_firstname, user_lastname, user_email, user_password]):
            return jsonify({"message": "All fields are required"}), 400

        # Generate OTP
        otp = generate_otp()

        # Save user to database
        new_user = User(
            user_firstname=user_firstname,
            user_lastname=user_lastname,
            user_email=user_email,
            user_password=generate_password_hash(user_password),
            user_otp=otp,
        )
        db.session.add(new_user)
        db.session.commit()

        # Send OTP via email
        try:
            send_email(user_email, f"Hi {user_firstname}, your OTP is {otp}")
        except Exception as e:
            print(f"Error sending email: {e}")
            return jsonify({"message": "User registered but OTP email failed"}), 500

        return jsonify({"message": "Registration successful! OTP sent."}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Registration failed"}), 400


@app.route('/verifyotp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Log the request data for debugging

        email = data.get('Email')
        otp = data.get('OTP')

        # Check if the email and OTP are provided in the request
        if not email or not otp:
            return jsonify({'error': 'Email and OTP are required'}), 400

        # Find the user by email
        user = User.query.filter_by(user_email=email).first()

        # Check if the user exists
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Ensure both OTP values are treated as strings for comparison
        if str(user.user_otp) == str(otp):  # Convert both to strings
            return jsonify({'message': 'OTP verified successfully!'}), 200
        else:
            return jsonify({'error': 'Invalid OTP'}), 400

    except Exception as e:
        print(f"Error during OTP verification: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/resendotp', methods=['POST'])
def resend_otp():
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Log the request data

        user_email = data.get('email')

        if not user_email:
            return jsonify({"message": "Email is required"}), 400

        user = User.query.filter_by(user_email=user_email).first()

        if not user:
            return jsonify({"message": "User not found"}), 404

        # Generate and update new OTP
        user.user_otp = generate_otp()
        db.session.commit()

        try:
            send_email(user.user_email, f"Hi {user.user_firstname}, your new OTP is {user.user_otp}")
        except Exception as e:
            print(f"Error sending email: {e}")
            return jsonify({"message": "Error sending email"}), 500

        return jsonify({"message": "OTP resent successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "Resend OTP failed"}), 400



@app.route('/login', methods=['POST', 'OPTIONS'])
def login_user():
    if request.method == 'OPTIONS':
        return '', 200  # Handle CORS preflight request

    data = request.get_json()
    email = data.get('Email')
    password = data.get('Password')

    if not email or not password:
        return jsonify({"error": "Email and Password are required!"}), 400

    user = User.query.filter_by(user_email=email).first()
    if user and check_password_hash(user.user_password, password):
        return jsonify({
            "message": "Login successful!",
            "Email": user.user_email
        }), 200
    else:
        return jsonify({"error": "Invalid credentials!"}), 401


@app.route('/modelpredict', methods=['POST'])
def model_predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and file.filename.lower().endswith(tuple(app.config['ALLOWED_EXTENSIONS'])):
        filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filename)

        img_tensor = preprocess_image(filename)

        prediction = predict_with_majority(models, img_tensor)

        return jsonify({
            'prediction': prediction['prediction'],
            'is_cancerous': prediction['is_cancerous']
        })
    else:
        return jsonify({'error': 'Invalid file format'}), 400


# Start Flask app
if __name__ == '__main__':
    app.run(debug=True)
