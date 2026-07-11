import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { authGuard } from './core/auth-guard';
import { Register } from './features/auth/register/register';
import { CustomerList } from './features/customers/customer-list/customer-list';
import { CustomerForm } from './features/customers/customer-form/customer-form';
import { LeadList } from './features/leads/lead-list/lead-list';
import { LeadForm } from './features/leads/lead-form/lead-form';
import { ContactList } from './features/contacts/contact-list/contact-list';
import { ContactForm } from './features/contacts/contact-form/contact-form';
import { InteractionList } from './features/interactions/interaction-list/interaction-list';
import { InteractionForm } from './features/interactions/interaction-form/interaction-form';
import { ActivityList } from './features/activities/activity-list/activity-list';
import { ActivityForm } from './features/activities/activity-form/activity-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'register', component: Register },
  { path: 'customers', component: CustomerList, canActivate: [authGuard] },
  { path: 'customers/new', component: CustomerForm, canActivate: [authGuard] },
  { path: 'customers/:id/edit', component: CustomerForm, canActivate: [authGuard] },
  { path: 'leads', component: LeadList, canActivate: [authGuard] },
  { path: 'leads/new', component: LeadForm, canActivate: [authGuard] },
  { path: 'leads/:id/edit', component: LeadForm, canActivate: [authGuard] },
  { path: 'contacts', component: ContactList, canActivate: [authGuard] },
  { path: 'contacts/new', component: ContactForm, canActivate: [authGuard] },
  { path: 'contacts/:id/edit', component: ContactForm, canActivate: [authGuard] },
  { path: 'interactions', component: InteractionList, canActivate: [authGuard] },
  { path: 'interactions/new', component: InteractionForm, canActivate: [authGuard] },
  { path: 'activities', component: ActivityList, canActivate: [authGuard] },
  { path: 'activities/new', component: ActivityForm, canActivate: [authGuard] },
  { path: 'activities/:id/edit', component: ActivityForm, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
