import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, NgbCarousel, NgbSlide],
  templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],  // <-- important!
})
export class HomeComponent {
  carouselImages = [
    {
      src: 'watch.jpg',
      title: 'Welcome to My watches',  
      description: 'This is the first slide.'
    },
    {
      src: 'watch.jpg',
      title: 'Welcome to My watches',  
      description: 'Some description for slide 2.'
    },
    {
      src: 'watch.jpg',
      title: 'Welcome to My watches',  
      description: 'This is the third and final slide.'
    }
  ];
}
