import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardContainerComponent } from './cardContainer.component'

@NgModule({
	imports:[CommonModule],
	declarations:[CardContainerComponent],
	exports:[CardContainerComponent]
})
export class CardContainerModule{}