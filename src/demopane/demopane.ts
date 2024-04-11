import { insertText } from '../taskpane/taskpane';
import { getDemoContent } from '../demopane/demoContent';

let avdelingElement: HTMLInputElement | null = null;
let lonnElement: HTMLInputElement | null = null;
let fastansattElement: HTMLInputElement | null = null;

export function initializeDemopane() {
  avdelingElement = document.getElementById('avdeling') as HTMLInputElement;
  lonnElement = document.getElementById('lonn') as HTMLInputElement;
  fastansattElement = document.getElementById('fastansatt') as HTMLInputElement;
  const button = document.getElementById('generateDocument');
  
  if (button) {
    button.addEventListener('click', () => {


      if (avdelingElement && lonnElement && fastansattElement) {
        let htmlText = getDemoContent(avdelingElement.value, lonnElement.value, fastansattElement.checked);
        
        if (htmlText) {
          insertText(htmlText);
        }
      }
    });
  }
}
