from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

NFS_MOUNT = os.getenv("NFS_MOUNT", "mnt-nfs")

@app.route('/file/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    file_path = os.path.join(NFS_MOUNT, file.filename)
    file.save(file_path)
    file.close()

    return jsonify({"message": "File uploaded successfully", "filename": file.filename}), 200

@app.route('/file/<filename>', methods=['GET'])
def get_file(filename):
    file_path = os.path.join(NFS_MOUNT, filename)
    app.logger.warning("AA")
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    app.logger.warning("BB")
    try:
        with open(file_path, 'r') as file: 
            app.logger.warning("CCC")
            content = file.read()
            app.logger.warning("DDD")
            app.logger.warning(content)
            file.close()
        return jsonify({"filename": filename, "content": content}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/file/<filename>', methods=['PUT'])
def update_file(filename):
    file_path = os.path.join(NFS_MOUNT, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    with open(file_path, 'wb') as f:
        app.logger.warning("Iskam da znam: ")
        app.logger.warning(request.data)
        f.write(request.data)
    
    f.close()

    return jsonify({"message": "File updated successfully"}), 200

@app.route('/file/<filename>', methods=['DELETE'])
def delete_file(filename):
    file_path = os.path.join(NFS_MOUNT, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    os.remove(file_path)
    return jsonify({"message": "File deleted successfully"}), 200

if __name__ == "__main__":
    os.makedirs(NFS_MOUNT, exist_ok=True)
    app.run(host="0.0.0.0", port=5000)