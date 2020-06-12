import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartContainerComponent } from './chartContainer.component'
import { ChartContainerRoutingModule } from './chartContainer.routing-module'

@NgModule({
	imports:[CommonModule,ChartContainerRoutingModule],
	declarations:[ChartContainerComponent],
	exports:[ChartContainerComponent]
})
export class ChartContainerModule{}