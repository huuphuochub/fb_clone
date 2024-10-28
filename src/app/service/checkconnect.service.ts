import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {

  private testUrl = 'https://jsonplaceholder.typicode.com/posts/1'; // URL kiểm tra kết nối
  private timeoutDuration = 5000; // Thời gian timeout (5 giây)

  constructor(private http: HttpClient) { }

  checkConnection(): Observable<boolean> {
    return this.http.get(this.testUrl, { observe: 'response', responseType: 'text' as 'json' }).pipe(
      timeout(this.timeoutDuration), // Đặt thời gian timeout
      map(response => response.status >= 200 && response.status < 300), // Kiểm tra mã trạng thái
      catchError(() => of(false)) // Nếu có lỗi, trả về false
    );
  }
}
