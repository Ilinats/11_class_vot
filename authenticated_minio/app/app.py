from flask import Flask, request, jsonify
from minio import Minio
from minio.error import S3Error
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from keycloak import KeycloakOpenID
import os

app = Flask(__name__)

KEYCLOAK_SERVER_URL = 'http://keycloak:8080/realms/file-management'
KEYCLOAK_CLIENT_ID = 'file-management-app'
KEYCLOAK_CLIENT_SECRET = 'h8GFNOiIHtAjDnGfBnQxKHZo7X7bAJPU'
KEYCLOAK_PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIIMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5R4S7LDLi6bVaiho1+P2uJgp7vOFyMhDb15z7IojkMyNZO7WorJTP9kgPBXD7jxtsw+/oA+navFExwNBdPky8HSa/9qH5yRwnKC23H5BSLGDnBEe+xbpW3uEAbhhJ4NQ8cd7yRK5tCJPN2oj5S3Ix2Gn79IBnItSVV9dlfDG6FRwficYiyG2F6Bw52KHhy+lHkG4s+vunRpzjqTHFsbYYbIW+fNRDaYt2pUSoOFbBMsabABzCFVEPJHkCGC51Ro2z3TP94wqA0l5UhS/gNW+ySHM+nMPgnjRlwpx14sfHOgQDyqyMs6wFqFsrkRhF/FqReqEGZWjhlfSm20I7xrT+wIDAQAB
-----END PUBLIC KEY-----
"""

app.config['JWT_ALGORITHM'] = 'RS256'
app.config['JWT_PUBLIC_KEY'] = KEYCLOAK_PUBLIC_KEY
jwt = JWTManager(app)

keycloak_openid = KeycloakOpenID(
    server_url=KEYCLOAK_SERVER_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    client_secret_key=KEYCLOAK_CLIENT_SECRET,
    realm_name='file-management',
)

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
    

def verify_jwt_token(token):
    try:
        keycloak_openid.introspect(token)
        return True
    except Exception as e:
        app.logger.warning("verity_jwt_token error");
        return False
    

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    current_user = get_jwt_identity()
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
@jwt_required()
def download_file(file_id):
    current_user = get_jwt_identity()
    try:
        file = minio_client.get_object(BUCKET_NAME, file_id)
        return file, 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/update/<file_id>', methods=['PUT'])
@jwt_required()
def update_file(file_id):
    current_user = get_jwt_identity()
    file = request.files['file']
    file_content = file.read()
    file.seek(0)

    try:
        minio_client.put_object(BUCKET_NAME, file_id, file, len(file_content))
        return jsonify({"message": f"Файлът '{file_id}' беше обновен успешно."}), 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/delete/<file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    current_user = get_jwt_identity()
    try:
        minio_client.remove_object(BUCKET_NAME, file_id)
        return jsonify({"message": f"Файлът '{file_id}' беше изтрит успешно."}), 200
    
    except S3Error as err:
        return jsonify({"error": str(err)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)