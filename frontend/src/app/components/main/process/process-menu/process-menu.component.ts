import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-process-menu',
  templateUrl: './process-menu.component.html',
  styleUrls: ['./process-menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessMenuComponent implements OnInit {

  @Output()
  onShowHideMenu = new EventEmitter<any>();

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    console.log("init process-menu");
  }

  showHideMenu() {
    this.onShowHideMenu.next();
  }
}
