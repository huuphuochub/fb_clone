import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveStateService {
  private currentPageSubject = new BehaviorSubject<string>('home');
  currentPage$ = this.currentPageSubject.asObservable();

  setCurrentPage(page: string) {
    this.currentPageSubject.next(page);
  }
}
