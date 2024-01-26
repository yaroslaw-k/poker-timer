import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainComponent} from "./main/components/main/main.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'poker-timer';
}
