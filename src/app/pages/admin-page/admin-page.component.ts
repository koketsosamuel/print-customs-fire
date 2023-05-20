import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
  adminLinks: any[] = [
    {
      name: 'Printing Positions',
      link: '/admin/printing-positions/view',
    },
    {
      name: 'Printing Methods',
      link: '/admin/printing-methods/view',
    },
    {
      name: 'Products',
      link: '/admin/products/view',
    },
    {
      name: 'Categories',
      link: '/admin/categories/view',
    },
    {
      name: 'Brands',
      link: '/admin/brands/view',
    },
  ];
}
