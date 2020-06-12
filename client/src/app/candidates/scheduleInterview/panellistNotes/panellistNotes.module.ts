import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { PanellistNotesComponent } from './panellistNotes.component';
import { PanellistNotesRoutingModule } from './panellistNotes-routing.module';

@NgModule({
	imports:[CommonModule,HttpModule,PanellistNotesRoutingModule],
	declarations:[PanellistNotesComponent],
	exports:[PanellistNotesComponent]
})
export class PanellistNotesModule{
	
}