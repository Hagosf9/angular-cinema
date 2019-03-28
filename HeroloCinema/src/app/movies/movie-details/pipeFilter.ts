import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'PipeFilter'
})
export class specialFilter implements PipeTransform {

  transform(title: string): string {
    let Abc = title.replace(/[^A-Za-z ]+/g, '');
    return this.camel(Abc);
  }

  camel(title: string): string {
    return title.split(' ').map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  }

}