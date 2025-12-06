import json
import logging
import os
import time
import requests
# type: ignore
import pika

API_KEY = os.getenv("OPENWEATHER_KEY")
CITY = "Rio de Janeiro"
BASE_URL = f"https://api.openweathermap.org/data/2.5/weather"
PARAMS = {
    "q": CITY,
    "appid": API_KEY,
    "lang": "pt_br",
    "units": "metric",
}

INTERVAL = 60 * 60

RABBITMQ_HOST = 'rabbitmq'
RABBITMQ_PASS = 'rabbitmq'
RABBITMQ_USER = 'rabbitmq'

LOG_DIR = "logs"

print(API_KEY)

os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    filename=f"{LOG_DIR}/errors.log",
    level=logging.ERROR,
    format="%(asctime)s - %(levelname)s - %(message)s" 
)


def create_channel(): 
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials)
        )
    channel = connection.channel()
    
    channel.queue_declare(queue='weather_queue', durable=True)
    
    return channel

def get_weather_data():
    try:
        response = requests.get(BASE_URL, params=PARAMS)
        response.raise_for_status()
        weatherData = response.json()
    except requests.exceptions.RequestException as e:
        logging.error("HTTP Request failed: %s", e)
        return None
    
    if weatherData["cod"] != 200:
         logging.error("HTTP Request failed: %s", e)
         return None
    
    print("Weather data collected!")
    return weatherData
    
    
def send_weather_data_to_worker(channel):
    weather = get_weather_data()
    
    if weather is None:
        return
    
    body = json.dumps(weather)
    
    channel.basic_publish(
        exchange='', 
        routing_key='weather_queue', 
        body=body,
        properties=pika.BasicProperties(delivery_mode=2),
    )
    
    print(" [x] Sent weather data to worker")
    
    
def main():
    channel = create_channel()
    
    print("Starting weather data collection...")
    while True:
        send_weather_data_to_worker(channel)
        time.sleep(INTERVAL)
        
if __name__ == "__main__":
    main()
    