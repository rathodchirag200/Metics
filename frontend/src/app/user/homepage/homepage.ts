import { Component } from '@angular/core';
import { Hero } from "../hero/hero";
import { Collection } from "../collection/collection";
import { Newarrivals } from "../newarrivals/newarrivals";
import { Hero2 } from "../hero2/hero2";
import { Reviews } from "../reviews/reviews";
import { Sale } from "../sale/sale";
import { Blog } from "../blog/blog";

@Component({
  selector: 'app-homepage',
  imports: [Hero, Collection, Newarrivals, Hero2, Reviews, Sale, Blog],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {

}
