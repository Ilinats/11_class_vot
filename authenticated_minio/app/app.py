from flask import Flask, request, jsonify
from minio import Minio
from minio.error import S3Error
import os

app = Flask(__name__)

minio_client = Minio(
    os.getenv("MINIO_URL", "minio:9000"),
    access_key=os.getenv("MINIO_ROOT_USER", "admin"),
    secret_key=os.getenv("MINIO_ROOT_PASSWORD", "admin123"),
    secure=False
)

BUCKET_NAME = "files"

try:
    if not minio_client.bucket_exists(BUCKET_NAME):
        minio_client.make_bucket(BUCKET_NAME)
        
except S3Error as err:
    print("Грешка при работа с MinIO:", err)


@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "Файлът няма име"}), 400
    
    file_id = file.filename
    
    try:
        file.seek(0)  
        file_length = len(file.read())
        file.seek(0)

        minio_client.put_object(BUCKET_NAME, file_id, file, file_length)
        return jsonify({"message": f"Файлът '{file_id}' беше качен успешно."}), 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/download/<file_id>', methods=['GET'])
def download_file(file_id):
    try:
        file = minio_client.get_object(BUCKET_NAME, file_id)
        return file, 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/update/<file_id>', methods=['PUT'])
def update_file(file_id):
    file = request.files['file']
    file_content = file.read()
    file.seek(0)

    try:
        minio_client.put_object(BUCKET_NAME, file_id, file, len(file_content))
        return jsonify({"message": f"Файлът '{file_id}' беше обновен успешно."}), 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/delete/<file_id>', methods=['DELETE'])
def delete_file(file_id):
    try:
        minio_client.remove_object(BUCKET_NAME, file_id)
        return jsonify({"message": f"Файлът '{file_id}' беше изтрит успешно."}), 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)