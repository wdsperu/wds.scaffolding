import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[wTemplate]',
    host: {
    }
})
export class WdsTemplateDirective {
    
    @Input() type: string;
    
    @Input('wTemplate') name: string;
    
    constructor(public template: TemplateRef<any>) {}
    
    getType(): string {
        return this.name;
    }
}
