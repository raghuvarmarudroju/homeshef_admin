import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterByIdPipe } from './filter-by-id.pipe'; 
import { ProfilePicturePipe } from './profilePicture.pipe';
import { UserSearchPipe } from './user-search.pipe';
import { RiderSearchPipe } from './rider-search.pipe';

@NgModule({
    imports: [ 
        CommonModule 
    ],
    declarations: [
        FilterByIdPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        RiderSearchPipe
    ],
    exports: [
        FilterByIdPipe,
        ProfilePicturePipe,
        UserSearchPipe,
        RiderSearchPipe
    ]
})
export class PipesModule { }
