import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../../components/navbar/navbar';
import { Footer } from '../../../components/footer/footer';

@Component({
  selector: 'app-marketing-layout',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './marketing-layout.html',
  styleUrl: './marketing-layout.scss',
})
export class MarketingLayout {}
