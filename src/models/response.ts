export default class JsonResponse {
  success: boolean;
  data: any;
  message: string;
  error: string;

  constructor(success: boolean, data: any, message: string, error: string) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error
  }
}