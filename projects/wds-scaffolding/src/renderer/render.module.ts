import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // this must add to app module.ts
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SpinnerModule } from 'primeng/spinner';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { WdsRendererInputContainerCpt } from './input.container/cpt';
import { WdsRendererBooleanInputSwitchCpt } from './input/booleanInputSwitch/cpt';
// import { WdsRendererBooleanToggleButtonCpt } from './input/booleanToggleButton/cpt';
// import { WdsRendererDateCalendarCpt } from './input/dateCalendar/cpt';
import { WdsRendererDropdownCpt } from './input/Dropdown/cpt';

import { WdsRendererInputDynamicDirective } from './input/input.render.directive';

// import { WdsRendererNumberInputCpt } from './input/numberInput/cpt';
// import { WdsRendererNumberSpinnerCpt } from './input/numberSpinner/cpt';
import { WdsRendererStringInputCpt } from './input/stringInput/cpt';
import { WdsRendererStringPasswordCpt } from './input/stringPassword/cpt';
import { WdsTableSelectableRendererCpt } from './input/tableVariable/cpt';



@NgModule({
    declarations: [
        WdsRendererInputContainerCpt,
        WdsRendererInputDynamicDirective,
        WdsRendererStringInputCpt,
        WdsRendererStringPasswordCpt,
        // WdsRendererNumberInputCpt,
        // WdsRendererNumberSpinnerCpt,
        WdsRendererBooleanInputSwitchCpt,
        // WdsRendererBooleanToggleButtonCpt,
        // WdsRendererDateCalendarCpt,
        WdsRendererDropdownCpt,
        WdsTableSelectableRendererCpt
    ],
    imports: [
        /* PrimeNg   */
        
        DropdownModule,
        SelectButtonModule,
        CardModule,
        InputMaskModule,
        KeyFilterModule,
        InputTextModule,
        DynamicDialogModule,
        PanelModule,
        TableModule,
        ButtonModule,
        ToggleButtonModule,
        MenuModule,
        FieldsetModule,
        PasswordModule,
        SpinnerModule,
        InputSwitchModule,
        CalendarModule,

        MatListModule,
        MatDialogModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTreeModule,
        MatIconModule, // <-- here

        // BrowserAnimationsModule,


        ReactiveFormsModule,
        FormsModule,
        NgxsFormPluginModule,

        // BrowserModule,
        CommonModule,
        DragDropModule,
        FlexLayoutModule,
        NgxsModule.forFeature([]),
        MessageModule,
        MultiSelectModule,
      
    ],
    providers: [],
    exports: [
        WdsRendererInputDynamicDirective,
        WdsRendererInputContainerCpt,
        WdsRendererStringInputCpt,
        WdsRendererStringPasswordCpt,
        // WdsRendererNumberInputCpt,
        // WdsRendererNumberSpinnerCpt,
        // WdsRendererDateCalendarCpt,

        WdsRendererBooleanInputSwitchCpt,
        // WdsRendererBooleanToggleButtonCpt,
        WdsRendererDropdownCpt,
        WdsTableSelectableRendererCpt
    ],
    entryComponents: [
        WdsRendererStringInputCpt,
        WdsRendererStringPasswordCpt,
        // WdsRendererNumberInputCpt,
        // WdsRendererNumberSpinnerCpt,
        WdsRendererBooleanInputSwitchCpt,
        // WdsRendererBooleanToggleButtonCpt,
        // WdsRendererDateCalendarCpt,
        WdsRendererDropdownCpt
    ]
})
export class WdsRendererModule { }
