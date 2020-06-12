import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpModule } from '@angular/http'
import * as _ from './index'
import {RouterService} from '../shared/service/router.service';
import { MatRadioModule,MatButtonModule,MatProgressBarModule,MatCheckboxModule,MatTableModule,MatProgressSpinnerModule,MatSidenavModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,MatTooltipModule,MatCardModule,MatGridListModule,MatTabsModule,MatChipsModule,MatMenuModule,MatDialogModule,MatToolbarModule,MatIconModule,MatSelectModule,MatInputModule,MatSnackBarModule,MatAutocompleteModule,MatSlideToggleModule } from '@angular/material';
import { Md2Module } from 'md2';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({

  imports: [CommonModule, RouterModule,FormsModule,ReactiveFormsModule,Md2Module,
            MatRadioModule,MatButtonModule,MatPaginatorModule,MatProgressBarModule,MatCheckboxModule,MatProgressSpinnerModule,MatTableModule,MatSidenavModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,MatTooltipModule,MatCardModule,MatGridListModule,MatTabsModule,MatChipsModule,MatMenuModule,MatDialogModule,MatToolbarModule,MatIconModule,MatSelectModule,MatInputModule,MatSnackBarModule,MatAutocompleteModule,MatSlideToggleModule],

  declarations: [_.ToolbarComponent, 
                _.NavbarComponent,
                _.ComposeMailComponent,
                _.TinyMCEComponent],
  entryComponents:[_.ComposeMailComponent],
  exports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule,            
            HttpModule,
            _.ToolbarComponent,
            _.NavbarComponent,
            _.ComposeMailComponent,Md2Module,
            _.TinyMCEComponent,
            MatRadioModule,MatButtonModule,MatPaginatorModule,MatProgressBarModule,MatCheckboxModule,MatProgressSpinnerModule,MatTableModule,MatSidenavModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,MatTooltipModule,MatCardModule,MatGridListModule,MatTabsModule,MatChipsModule,MatMenuModule,MatDialogModule,MatToolbarModule,MatIconModule,MatSelectModule,MatInputModule,MatSnackBarModule,MatAutocompleteModule,MatSlideToggleModule]

})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ CookieService,_.CandexService,_.AuthService,_.ProgressBarService,_.RouterService]
    };
  }
}