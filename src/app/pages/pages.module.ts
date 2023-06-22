import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesRouterModule } from './pages.routes';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { CoreModule } from '../core/core.module';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';

import { TablesModule } from '../tables/tables.module';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighlightModule } from 'ngx-highlightjs';
import { TablesRouterModule } from '../tables/tables.router';
import { MatMenuModule } from '@angular/material/menu';
import { PrViewComponent } from './pr-view/pr-view.component';
import { PrAddComponent } from './pr-add/pr-add.component';
import { PrItemComponent } from './pr-item/pr-item.component';
import { ItemsViewComponent } from './items-view/items-view.component';
import { ApprovePrComponent } from './approve-pr/approve-pr.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SampleCompComponent } from './sample-comp/sample-comp.component';

// Import the required ngx-bootstrap modules and components here
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationComponent } from './modals/confirmation/confirmation.component';
import { ModalComponent } from './modals/modal/modal.component';
import { PrEditComponent } from './modals/pr-edit/pr-edit.component';

import {MatSelectModule} from '@angular/material/select';
import { ConfirmationGenericComponent } from './modals/confirmation-generic/confirmation-generic.component';

@NgModule({
    imports: [
        MatCardModule,
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatCheckboxModule,
        MatListModule,
        MatChipsModule,
        CoreModule,
        PagesRouterModule,
        MatTableModule,
        MatTabsModule,
        MatStepperModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        HighlightModule,
        TablesRouterModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        // Add the imported ngx-bootstrap modules here
        AlertModule.forRoot(),
        BsDropdownModule.forRoot(),
        MatDialogModule,
        MatSelectModule
      ],
    declarations: [
        ContactComponent,
        AboutComponent,
        ServicesComponent,
        ViewDocumentsComponent,
        PrViewComponent,
        PrAddComponent,
        PrItemComponent,
        ItemsViewComponent,
        ApprovePrComponent,
        SampleCompComponent,
        ConfirmationComponent,
        ModalComponent,
        PrEditComponent,
        ConfirmationGenericComponent
    ],
    exports: [
    ],
    providers: [
    ]
})
export class PagesModule {
}
