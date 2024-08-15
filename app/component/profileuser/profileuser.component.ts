import { Component,OnInit } from '@angular/core';
import { ActiveStateService } from '../../service/active-state.service';


@Component({
  selector: 'app-profileuser',
  templateUrl: './profileuser.component.html',
  styleUrl: './profileuser.component.css'
})
export class ProfileuserComponent implements OnInit{
  constructor(private activeStateService: ActiveStateService) {}


  ngOnInit(): void {
    this.activeStateService.setCurrentPage('');

  }

}
