from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from keycloak import KeycloakOpenID
import os

app = Flask(__name__)

KEYCLOAK_SERVER_URL = 'http://keycloak:8080/realms/file-management'
KEYCLOAK_CLIENT_ID = 'file-management-app'
KEYCLOAK_CLIENT_SECRET = '6B5Hz7yOEE8BQvB55XIbq3vTc9cpsbTK'
KEYCLOAK_PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyGrJTOSfPTgSqhMK896OYmkAZkT4rHQlPxiAGnCgZ447wUkEKO8LI1w8pa7IOR8fZ/LvmqjAZZ6hJoT1XPxggmMwEHEixdbLgZA2G5lJR9l2mUgMjB2qhRcwOVt9voYt1IFkySEcxX9v/kdWL+5afYHKW8BQ6SST3k2+VovzAuulxVc3f6b099ZhJBy7Oftchbo+OiQxOGwEF+fZJUQp/OxCmTYp6jkfUIuxzJf2YBQ8QUomr1qM1iJRocqI0KEtQ7CiVIWDTd1nNH23DfykojP/8PVaSHkXqKgJbK90Rzj86QRi1Acvyi9FBfbqev2OznsDANdCDVJDlZR6N1OfTQIDAQAB
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

NFS_MOUNT = os.getenv("NFS_MOUNT", "mnt-nfs")

def verify_jwt_token(token):
    try:
        keycloak_openid.introspect(token)
        return True
    except Exception as e:
        app.logger.warning("verity_jwt_token error");
        return False

@app.route('/file/upload', methods=['POST'])
@jwt_required()
def upload_file():
    current_user = get_jwt_identity()

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = os.path.join(NFS_MOUNT, file.filename)
    file.save(file_path)
    file.close()

    return jsonify({"message": "File uploaded successfully", "filename": file.filename}), 200

@app.route('/file/<filename>', methods=['GET'])
@jwt_required()
def get_file(filename):
    current_user = get_jwt_identity()

    file_path = os.path.join(NFS_MOUNT, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    try:
        with open(file_path, 'r') as file: 
            content = file.read()
        return jsonify({"filename": filename, "content": content}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/file/<filename>', methods=['PUT'])
@jwt_required()
def update_file(filename):
    current_user = get_jwt_identity()

    file_path = os.path.join(NFS_MOUNT, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    with open(file_path, 'wb') as f:
        f.write(request.data)
    f.close()

    return jsonify({"message": "File updated successfully"}), 200

@app.route('/file/<filename>', methods=['DELETE'])
@jwt_required()
def delete_file(filename):
    current_user = get_jwt_identity()

    file_path = os.path.join(NFS_MOUNT, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    os.remove(file_path)
    return jsonify({"message": "File deleted successfully"}), 200

if __name__ == "__main__":
    os.makedirs(NFS_MOUNT, exist_ok=True)
    app.run(host="0.0.0.0", port=5000)