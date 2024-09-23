import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { orderStatusList } from '../../../../../../constants/order-status-list';
import { NgClass } from '@angular/common';

@Component({
  selector: 'status',
  standalone: true,
  imports: [NgClass],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css'
})
export class StatusComponent implements OnInit {

  @Input() currentStatus: string = "";

  @Output() onStatusChange = new EventEmitter<{ status: string }>();

  orderStatusList = orderStatusList;

  statusHistory: string[] = [];


  ngOnInit(): void {
    this.updateStatusHistory(this.currentStatus);
  }

  updateStatusHistory(currentStatus: string) {
    switch (currentStatus) {
      case this.orderStatusList.PLACED:
        this.statusHistory = [currentStatus];
        break;
      case this.orderStatusList.PICKED:
        this.statusHistory = [this.orderStatusList.PLACED, currentStatus];
        break;
      case this.orderStatusList.PACKED:
        this.statusHistory = [this.orderStatusList.PLACED, this.orderStatusList.PICKED, currentStatus];
        break;
      case this.orderStatusList.SHIPPED:
        this.statusHistory = [this.orderStatusList.PLACED, this.orderStatusList.PICKED, this.orderStatusList.PACKED, currentStatus];
        break;
      case this.orderStatusList.DELIVERED:
        this.statusHistory = [this.orderStatusList.PLACED, this.orderStatusList.PICKED, this.orderStatusList.PACKED, this.orderStatusList.SHIPPED, currentStatus];
        break;
    }
  }



  emitOnStatusChange(status: string) {
    this.onStatusChange.emit({ status: status });
    this.updateStatusHistory(status);
    console.log(this.statusHistory);
  }








}
