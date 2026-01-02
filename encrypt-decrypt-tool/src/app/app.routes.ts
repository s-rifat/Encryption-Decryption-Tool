import { Routes } from '@angular/router';
import { CaesarCipherComponent } from './caesar-cipher/caesar-cipher.component';
import { AffineCipherComponent } from './affine-cipher/affine-cipher.component';
import { PlayfairCipherComponent } from './playfair-cipher/playfair-cipher.component';
import { HillCipherComponent } from './hill-cipher/hill-cipher.component';
import { HillCrackerComponent } from './hill-cracker/hill-cracker.component';

export const routes: Routes = [
    { path: 'caesar-cipher', component: CaesarCipherComponent },
    { path: 'affine-cipher', component: AffineCipherComponent },
    { path: 'playfair-cipher', component: PlayfairCipherComponent },
    { path: 'hill-cipher', component: HillCipherComponent },
    { path: 'hill-cracker', component: HillCrackerComponent }
];

