import boto3
import sqlite3
import json
import time

conn = sqlite3.connect("mydb.db")
sqs = boto3.resource("sqs")
queue = sqs.get_queue_by_name(QueueName="MyQueue")

def process_message(message_body):
    body = json.loads(message_body)
    cur = conn.cursor()
    cur.execute("update messages set status = 'Processing' where message_id=:message_id", {"message_id": body["message_id"]})
    conn.commit()
    print(body['message_id'] + " started processing")
    # process code
    time.sleep(int(body['sleep_time']))
    cur.execute("update messages set status = 'Completed' where message_id=:message_id", {"message_id": body["message_id"]})
    conn.commit()
    print(body['message_id'] + " completed processing")

if __name__ == "__main__":
    while True:
        messages = queue.receive_messages()
        for message in messages:
            process_message(message.body)
            message.delete()