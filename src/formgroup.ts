interface RegexObject {
  [key: string]: RegExp | string;
}

const HTMLElementIdRegex = /^[a-zA-Z][\da-zA-Z-_]$/;

abstract class Validators {
  constructor() {}

  /**
   * @param  {number} length
   * @returns RegexObject
   */
  public static minLength(length: number): RegexObject {
    return {
      minLength: new RegExp(`^.{${length},}$`),
    };
  }

  /**
   * @param  {number} length
   * @returns RegexObject
   */
  public static maxLength(length: number): RegexObject {
    return {
      maxLength: new RegExp(`^.{0,${length}}$`),
    };
  }

  /**
   * @returns RegexObject
   */
  public static get personName(): RegexObject {
    return {
      personName: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get email(): RegexObject {
    return {
      email:
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get phonenumber(): RegexObject {
    return {
      phonenumber: /^\+[1-9]{1}[0-9]{3,14}$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get iban(): RegexObject {
    return {
      iban: /^(?:(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/i,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get street(): RegexObject {
    return {
      street: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get streetnumber(): RegexObject {
    return {
      streetnumber: /^[0-9]+[a-zäöü]?$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get postcode(): RegexObject {
    return {
      postcode: /^[0-9]{5}$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get city(): RegexObject {
    return {
      city: /^[A-ZÄÖÜ]([A-Za-zÄÖÜäöüß]+(\-| )?)*[a-zäöüß]$/,
    };
  }

  /**
   * @returns RegexObject
   */
  public static get password(): RegexObject {
    return {
      password:
        /^(?=.*\d)(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])[\da-zA-ZÄÖÜäöüß!$%&/\\(){}[\]=?*+~#\-_.:,;^°@]{8,}$/,
    };
  }
  /**
   * @param  {string} formControlName
   * @returns RegexObject
   */
  public static equals(formControlName: string): RegexObject {
    return {
      equalsControlName: formControlName,
    };
  }

  /**
   * @param  {string} value
   * @returns RegexObject
   * @description Only works with select!
   */
  public static requireOption(value: string): RegexObject {
    return {
      requiredOption: new RegExp(`^${value}$`),
    };
  }
  /**
   * @returns RegexObject
   */
  public static get required(): RegexObject {
    return {
      required: /^required$/,
    };
  }
}

type supportedElementTypes =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type supportedElementTags = "input" | "textarea" | "select" | "checkbox";

class FormControl {
  private _formGroup!: FormGroup;
  private _name: string;
  private _regexObject: { [key: string]: RegExp | string } = {};
  private _HTMLElementTag: supportedElementTags = "input";
  private _element!: supportedElementTypes;
  private _options!: HTMLOptionElement[];
  private _value: string | number | null = null;
  private _valid: boolean = true;
  private _type?: inputType;
  private _multipleInputs: HTMLInputElement[] = [];

  /**
   * @param  {string} name
   * @param  {supportedElementTags} HTMLElementTag
   * @param  {RegexObject|RegexObject[]} validators?
   */
  constructor(
    name: string,
    HTMLElementTag: supportedElementTags,
    validators?: RegexObject | RegexObject[],
    type?: inputType
  ) {
    this._name = name;
    this._type = type;
    this.addValidators(validators || []);
    if (HTMLElementTag) this._HTMLElementTag = HTMLElementTag;
  }

  /**
   * @param  {Event} e
   * @returns void
   */
  private getInputData(e: Event): void {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    this._value = target.value;
  }

  /**
   * @private
   * @returns void
   */
  private addListeners(): void {
    switch (this._HTMLElementTag) {
      case "input":
        if (this._type === "radio" && this._multipleInputs.length > 0) {
          this._multipleInputs.forEach((inputEl) => {
            if (inputEl.checked) this._value = inputEl.value;
          });
          break;
        }
      case "textarea":
        this._element.addEventListener("keyup", (e) => this.getInputData(e));
        this._element.addEventListener("blur", () => this.checkValidity());
        break;
      case "select":
      case "checkbox":
        this._element.addEventListener("change", (e) => this.getInputData(e));
        break;
    }
  }

  /**
   * @returns void
   */
  private updateDOMElement(): void {
    if (this._valid) {
      if (this._element.classList.contains("invalid"))
        this._element.classList.remove("invalid");
      this._element.classList.add("valid");
    } else {
      if (this._element.classList.contains("valid"))
        this._element.classList.remove("valid");
      this._element.classList.add("invalid");
    }
  }
  /**
   * @param  {RegExp}[]{} regex
   * @returns RegExp
   */
  private getRegexArr(): [string, RegExp | string][] {
    return Object.entries(this._regexObject);
  }

  /**
   * @param  {string} id
   * @returns HTMLOptionElement
   */
  private getOption(value: string): HTMLOptionElement {
    const option = this._options.find((option) => option.value === value);
    if (!option) throw `Cannot find option with value "${value}"!`;
    return option;
  }
  /**
   * @returns HTMLOptionElement
   */
  private get selectedOptions(): HTMLOptionElement[] {
    const options: HTMLOptionElement[] = [];
    for (const option of this._options)
      if (option.selected) options.push(option);
    return options;
  }
  /**
   * @returns void
   */
  public getDOMValue(): void {
    switch (this._HTMLElementTag) {
      default:
        this._value = this._element.value;

        if (this._type === "number") this._value = Number(this._value);

        if (this._type === "radio" && this._multipleInputs.length > 0)
          this._multipleInputs.forEach((inputEl) => {
            if (inputEl.checked) this._value = inputEl.value;
          });
    }
  }

  /**
   * @returns void
   */
  public checkValidity(): void {
    const regexArr = this.getRegexArr();
    let valid: boolean = true;

    this.getDOMValue();

    switch (this._HTMLElementTag) {
      case "input":
      case "textarea":
        let value: string;
        regexArr.forEach(([name, regex]) => {
          value = (this._value as string).trim();
          switch (name) {
            case "iban":
              value = (this._value as string).replaceAll(" ", "");
            case "equalsControlName":
              const controlName = regex;
              const control = this._formGroup.FormControls.find(
                (control) => control.name === controlName
              );
              if (!control)
                throw `Cannot find control "${controlName}" for value equals check.`;
              if (value !== control.value) valid = false;
              break;
            case "required":
              if (!value) valid = false;
              break;
            default:
              if (!(regex as RegExp).test(value)) valid = false;
          }
        });
        break;
      case "select":
        const requiredOption = this._regexObject.requiredOption;
        if (requiredOption)
          for (const option of this._options)
            if (
              (requiredOption as RegExp).test(option.value) &&
              !option.selected
            )
              valid = false;
        break;
      case "checkbox":
        const required = this._regexObject.required;
        if (required && !(this._element as any).checked) valid = false;
        break;
    }
    this._valid = valid;
    this.updateDOMElement();
  }

  /**
   * @returns string
   */
  public get name(): string {
    return this._name;
  }

  /**
   * @returns string
   */
  public get HTMLElementTag(): supportedElementTags {
    return this._HTMLElementTag;
  }

  /**
   * @returns string
   */
  public get value(): string {
    return this._value as string;
  }

  /**
   * @returns boolean
   */
  public get valid(): boolean {
    return this._valid;
  }
  /**
   * @returns inputType
   */
  public get type(): inputType | undefined {
    return this._type;
  }

  /**
   * @private
   * @param  {supportedElementTypes} element
   * @description Should not be called!
   */
  public set _DOMElement(element: supportedElementTypes) {
    this._element = element;
    if (this._HTMLElementTag === "select") {
      const options = this._element.children;
      if (options.length < 1)
        throw `Please add at least one option to select ${this._name}!`;
      this._options = options as unknown as HTMLOptionElement[];
    }
    this.addListeners();
  }

  /**
   * @private
   * @param  {FormGroup} formGroup
   * @description Should not be called!
   */
  public set _FormGroup(formGroup: FormGroup) {
    this._formGroup = formGroup;
  }
  /**
   * @param  {string} value
   */
  public set value(value: string) {
    this._value = value;
    this._element.value = value;
  }
  /**
   * @param  {HTMLInputElement[]} inputs
   */
  public set radioInputs(inputs: HTMLInputElement[]) {
    this._multipleInputs = inputs;
  }

  /**
   * @param  {RegexObject|RegexObject[]} validators
   * @returns void
   * @description Adds one or more Validators to the FormControl.
   */
  public addValidators(validators: RegexObject | RegexObject[]): void {
    if (Array.isArray(validators))
      validators.forEach((validator) =>
        Object.assign(this._regexObject, validator)
      );
    else Object.assign(this._regexObject, validators);
  }

  /**
   * @param  {RegexObject|RegexObject[]} validators
   * @returns void
   * @description Removes one or more Validators from the FormControl.
   */
  public removeValidators(validators: RegexObject | RegexObject[]): void {
    if (Array.isArray(validators))
      validators.forEach(
        (validator) =>
          delete this._regexObject[Object.getOwnPropertyNames(validator)[0]]
      );
    else delete this._regexObject[Object.getOwnPropertyNames(validators)[0]];
  }
}

type inputType = "text" | "radio" | "number" | "password";
class Input extends FormControl {
  /**
   * @param  {string} name
   * @param  {RegexObject|RegexObject[]} validators?
   * @param  {inputType="text"} type
   */
  constructor(
    name: string,
    validators?: RegexObject | RegexObject[],
    type?: inputType
  ) {
    super(name, "input", validators, type);
  }
}

class Textarea extends FormControl {
  /**
   * @param  {string} name
   * @param  {RegexObject|RegexObject[]} validators?
   */
  constructor(name: string, validators?: RegexObject | RegexObject[]) {
    super(name, "textarea", validators);
  }
}

class Select extends FormControl {
  /**
   * @param  {string} name
   * @param  {RegexObject|RegexObject[]} validators?
   */
  constructor(name: string, validators?: RegexObject | RegexObject[]) {
    super(name, "select", validators);
  }
}

class Checkbox extends FormControl {
  /**
   * @param  {string} name
   * @param  {RegexObject|RegexObject[]} validators?
   */
  constructor(name: string, validators?: RegexObject | RegexObject[]) {
    super(name, "checkbox", validators);
  }
}

interface Controls {
  [key: string]: FormControl;
}

/**
 * @typedef {Object.<string, string>} FormData
 */
interface FormGroupData {
  [key: string]: string;
}

class FormGroup {
  private _supportedElementTags = ["input", "textarea", "select", "checkbox"];
  private _controls: Controls;
  private _name: string;
  private _element!: HTMLFormElement;
  private _onSubmitCallback!: (formData: FormGroupData) => void;
  private _onErrorCallback!: (invalidControls: Controls) => void;
  private _invalidControls!: Controls;

  /**
   * @typedef {Object.<string, FormControl>} Controls - e.g.: { email: new FormControl("email", Validators.email)}
   * @param {name} name HTMLAttribute: formGroup="name"
   * @param {Controls} controls
   */
  constructor(name: string, controls: Controls) {
    this._name = name;
    this._controls = controls;

    this.getFormElement();
    this.addListeners();
    this.validateFormControls();
  }

  /**
   * @returns void
   */
  protected validateFormControls(): void {
    let element: HTMLElement;
    let tag: supportedElementTags;
    this.FormControls.forEach((control) => {
      tag = control.HTMLElementTag;
      if (!this._supportedElementTags.includes(tag))
        throw "Unsupported HTMLElement!";

      if (tag === "checkbox") tag = "input";

      element = document.querySelector(
        `form[formGroup="${this._name}"] ${tag}[formControl="${control.name}"]`
      ) as HTMLElement;
      if (!element)
        throw `Couldn't find <${tag}> with formControl="${control.name}"!`;

      // multiple elements on radio
      if (control.type === "radio") {
        const radioName = (element as HTMLInputElement).name;
        const radioElements = document.querySelectorAll(
          `form[formGroup="${this._name}"] input[name="${radioName}"]`
        );
        if (radioElements)
          control.radioInputs = radioElements as unknown as HTMLInputElement[];
      }

      control._DOMElement = element as any;
      control._FormGroup = this;
    });
  }

  /**
   * @returns void
   */
  protected getFormElement(): void {
    const element = document.querySelector(`form[formGroup="${this._name}"]`);
    if (!element)
      throw `Couldn't find HTMLFormElement with attribute formGroup="${this._name}"!`;
    this._element = element as HTMLFormElement;
  }

  /**
   * @returns void
   */
  protected getData(): FormGroupData {
    let data: FormGroupData = {};
    const controlNames = Object.keys(this._controls);
    let control: FormControl;
    this._invalidControls = {};
    controlNames.forEach((name) => {
      control = this._controls[name];
      control.checkValidity();
      if (!control.valid) this._invalidControls[name] = control;
      data[name] = this._controls[name].value;
    });
    return data;
  }

  /**
   * @returns void
   * @description Adds "submit" EventListener to the FormElement;
   */
  protected addListeners(): void {
    this._element!.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const data = this.getData();
        if (!this._onSubmitCallback)
          console.warn("No onSubmit callback function!");
        else if (Object.keys(this._invalidControls).length > 0) {
          if (this._onErrorCallback)
            this._onErrorCallback(this._invalidControls);
        } else if (this._onSubmitCallback) this._onSubmitCallback(data);
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**
   * @param  {(data:FormGroupData)=>void} callbackFn
   * @returns void
   * @description The FormGroup adds an EventListener ("submit") to the HTMLFormElement. The callback function will be triggered on the submit event of the form.
   */
  public onSubmit(
    callbackFn: (data: FormGroupData) => void,
    errorCallbackFn: (invalidControls: Controls) => void
  ): void {
    this._onSubmitCallback = callbackFn;
    this._onErrorCallback = errorCallbackFn;
  }

  /**
   * @returns Array<Input | Textarea | Select | Checkbox>
   */
  public get FormControls(): Array<Input | Textarea | Select | Checkbox> {
    return Object.entries(this._controls).map(
      (entry) => entry[1] as Input | Textarea | Select | Checkbox
    );
  }
  /**
   * @param  {string} name
   * @returns Input
   */
  public getFormControlByName(
    name: string
  ): Input | Textarea | Select | Checkbox | undefined {
    return this.FormControls.find((control) => control.name === name);
  }
}
