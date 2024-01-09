import { Menu } from './menu.model'; 

export const menuItems = [ 
    
    new Menu (1, 'Dashboard', '/admin', null, 'dashboard', null, false, 0,[1,3,5,8]),

    new Menu (2, 'ADMIN_NAV.CATEGORIES', '/admin/menu-items/categories', null, 'category', null, false, 0,[1,3]),

    new Menu (3, 'Banners', '/admin/slides', null, 'restaurant_menu', null, false, 0,[1,3,5]),

    new Menu (4, 'Cuisines', '/admin/cuisines', null, 'restaurant_menu', null, false, 0,[1,3,5]), 

    new Menu (5, 'Ingredients', '/admin/ingredients', null, 'ac_unit', null, false, 0,[1,3,5]),

    new Menu (6, 'ADMIN_NAV.MENU_ITEMS', '/admin/menu-items/list', null, 'list', null, false, 0,[1,3]),

    new Menu (7, 'ADMIN_NAV.SALES', null, null, 'monetization_on', null, true, 0,[1,3,5,8]),  
    new Menu (8, 'ADMIN_NAV.ORDERS', '/admin/sales/orders', null, 'list_alt', null, false, 7,[1,3,5,8]),
    new Menu (9, 'ADMIN_NAV.TRANSACTIONS', '/admin/sales/transactions', null, 'local_atm', null, false, 7,[1,3,5]),

    new Menu (10, 'Chefs', null, null, 'supervisor_account', null, true, 0,[1,3,5,8]),  
    new Menu (11, 'Chefs', '/admin/chefs', null, 'list_alt', null, false, 10,[1,3,5,8]),
    new Menu (12, 'Approvals', '/admin/chefs/approvals', null, 'local_atm', null, false, 10,[1,3,5]),

    new Menu (13, 'ADMIN_NAV.ADD_MENU_ITEM', '/admin/menu-items/add', null, 'add_circle_outline', null, false, 20,[8]), 

    new Menu (14, 'Riders', '/admin/riders', null, 'group_add', null, false, 0,[1,3,5]), 
    
     
    new Menu (15, 'ADMIN_NAV.RESERVATIONS', '/admin/reservations', null, 'event', null, false, 0,[1,3,5]),  
    new Menu (16, 'ADMIN_NAV.CUSTOMERS', '/admin/customers', null, 'supervisor_account', null, false, 0,[1,3,5]),  
    new Menu (17, 'ADMIN_NAV.COUPONS', '/admin/coupons', null, 'card_giftcard', null, false, 0,[1,3,5]),  
    new Menu (28, 'ADMIN_NAV.WITHDRAWAL', '/admin/withdrawal', null, 'credit_card', null, false, 0,[1,3,5])
]