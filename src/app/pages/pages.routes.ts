import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { PrViewComponent } from './pr-view/pr-view.component';
import { PrAddComponent } from './pr-add/pr-add.component';
import { ItemsViewComponent } from './items-view/items-view.component';
import { ApprovePrComponent } from './approve-pr/approve-pr.component';
import { SampleCompComponent } from './sample-comp/sample-comp.component';

const pagesRoutes: Routes = [
  	{ path: 'contact', component: ContactComponent ,data: { animation: 'contact' } },
  	{ path: 'about', component: AboutComponent ,data: { animation: 'about' }},
  	{ path: 'services', component: ServicesComponent ,data: { animation: 'services' }},
    { path: 'viewDocuments', component: ViewDocumentsComponent ,data: { animation: 'viewDocuments' }},
    { path: 'viewPR', component: PrViewComponent ,data: { animation: 'viewPR' }},
    { path: 'addPR', component: PrAddComponent ,data: { animation: 'addPR' }},
    { path: 'viewItems', component: ItemsViewComponent ,data: { animation: 'viewItems' }},
    { path: 'approvePr', component: ApprovePrComponent ,data: { animation: 'approvePr' }},
    { path: 'samplecomp', component: SampleCompComponent ,data: { animation: 'samplecomp' }},

]
@NgModule({
  imports: [
    RouterModule.forChild(pagesRoutes)
  	],
  exports: [
    RouterModule
  ]
})
export class PagesRouterModule {}
