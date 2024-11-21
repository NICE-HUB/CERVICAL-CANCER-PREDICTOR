import tensorflow as tf
from keras.layers import Layer

class CustomScaleLayer(Layer):
       def __init__(self, scale=1.0, **kwargs):
           self.scale = scale  # Store the scale value
           super(CustomScaleLayer, self).__init__(**kwargs)

       def call(self, inputs):
           # Check the type of inputs
           print(f"Inputs: {inputs}, Type: {type(inputs)}")
           
           if isinstance(inputs, list):
               input1, input2 = inputs
           else:
               raise ValueError("Expected a list of inputs.")

           # Ensure inputs are tensors
           if not isinstance(input1, tf.Tensor) or not isinstance(input2, tf.Tensor):
               raise ValueError("Both inputs must be tensors.")

           output = input1 * input2 * self.scale  # Use the scale in the operation
           return output