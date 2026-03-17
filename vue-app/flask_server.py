import cv2
from flask import Flask, Response
import threading
import time

app = Flask(__name__)

# 手动添加CORS头
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# 全局变量控制摄像头状态
camera_active = False
cap = None

def generate_frames():
    global camera_active, cap
    while camera_active:
        success, frame = cap.read()
        if not success:
            break
        # 降低分辨率以提高性能
        frame = cv2.resize(frame, (640, 480))
        # 编码为JPEG
        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n' 
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.025)  # 控制帧率约40fps

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def start_camera_server():
    global camera_active, cap
    camera_active = True
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("无法打开摄像头")
        return
    print("摄像头已启动，访问 http://localhost:5000/video_feed 查看视频流")
    app.run(host='0.0.0.0', port=5000, threaded=True)

def stop_camera_server():
    global camera_active, cap
    camera_active = False
    if cap and cap.isOpened():
        cap.release()
    print("摄像头已关闭")

if __name__ == '__main__':
    try:
        start_camera_server()
    except KeyboardInterrupt:
        stop_camera_server()