import { Menu } from './menu.model'; 

export const menuItems = [ 
    
    new Menu (10, 'Dashboard', '/admin', null, 'dashboard', null, false, 0,[1,3,5,8]),
    new Menu (21, 'ADMIN_NAV.CATEGORIES', '/admin/menu-items/categories', null, 'category', null, false, 0,[1,3]),
    new Menu (42, 'Cuisines', '/admin/cuisines', null, 'restaurant_menu', null, false, 0,[1,3,5]), 
    new Menu (43, 'Ingredients', '/admin/ingredients', null, 'ac_unit', null, false, 0,[1,3,5]),
    new Menu (22, 'ADMIN_NAV.MENU_ITEMS', '/admin/menu-items/list', null, 'list', null, false, 0,[1,3]), 
    new Menu (31, 'ADMIN_NAV.ORDERS', '/admin/sales/orders', null, 'list_alt', null, false, 30,[1,3,5,8]),  
    new Menu (24, 'ADMIN_NAV.ADD_MENU_ITEM', '/admin/menu-items/add', null, 'add_circle_outline', null, false, 20,[8]), 
    new Menu (30, 'ADMIN_NAV.SALES', null, null, 'monetization_on', null, true, 0,[1,3,5,8]),  
     
    new Menu (32, 'ADMIN_NAV.TRANSACTIONS', '/admin/sales/transactions', null, 'local_atm', null, false, 30,[1,3,5]),  
    new Menu (40, 'Chefs', '/admin/users', null, 'group_add', null, false, 0,[1,3,5]), 
    new Menu (41, 'Riders', '/admin/riders', null, 'group_add', null, false, 0,[1,3,5]), 
    
     
    new Menu (45, 'ADMIN_NAV.RESERVATIONS', '/admin/reservations', null, 'event', null, false, 0,[1,3,5]),  
    new Menu (50, 'ADMIN_NAV.CUSTOMERS', '/admin/customers', null, 'supervisor_account', null, false, 0,[1,3,5]),  
    new Menu (60, 'ADMIN_NAV.COUPONS', '/admin/coupons', null, 'card_giftcard', null, false, 0,[1,3,5]),  
    new Menu (70, 'ADMIN_NAV.WITHDRAWAL', '/admin/withdrawal', null, 'credit_card', null, false, 0,[1,3,5])
]