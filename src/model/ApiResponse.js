class ApiResponse {
    constructor(code, message, data, timestamp, path, error) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
        this.path = path;
        this.error = error;
    }
}

export default ApiResponse;