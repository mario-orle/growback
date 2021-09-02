import urllib.request
import Adafruit_DHT

DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 23
humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)

if humidity is not None and temperature is not None:
        print("T={0:0.1f} H={1:0.1f}".format(temperature, humidity))