interface RegexObject {
  [key: string]: RegExp;
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
      email: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
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
      password: /^(?=.*\d)(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])[\da-zA-ZÄÖÜäöüß!$%&/\\(){}[\]=?*+~#\-_.:,;^°@]{8,}$/,
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
   * @description Only works with checkbox!
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
  private _name: string;
  private _regexObject: { [key: string]: RegExp } = {};
  private _HTMLElementTag: supportedElementTags = "input";
  private _element!: supportedElementTypes;
  private _options!: HTMLOptionElement[];
  private _value: string = "";
  private _valid: boolean = true;

  /**
   * @typedef {Validators} validators
   * @param  {string} name HTMLAttribute: formControl="name"
   * @param  {Validators} validators optional. Pass in a Validator (e.g.: Validator.email)
   * @param  {supportedElementTags} HTMLElementTag optional. Supported tags: input | textarea | select
   * @description Handles the state of the HTMLElement. Adds CSS classes for visual feedback (invalid: .invalid, valid: .valid)
   */
  constructor(
    name: string,
    validators?: RegexObject | RegexObject[],
    HTMLElementTag?: supportedElementTags
  ) {
    this._name = name;
    if (validators) {
      if (Array.isArray(validators))
        validators.forEach(
          (validator) =>
            (this._regexObject = Object.assign(this._regexObject, validator))
        );
      else this._regexObject = validators;
    }
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
   * @returns void
   */
  private addListeners(): void {
    switch (this._HTMLElementTag) {
      case "input":
      case "textarea":
        this._element.addEventListener("keyup", (e) => this.getInputData(e));
        this._element.addEventListener("blur", () =>
          this.udpateValueAndValidity()
        );
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
  private getRegexArr(): [string, RegExp][] {
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
  public udpateValueAndValidity(): void {
    const regexArr = this.getRegexArr();
    let valid: boolean = true;

    switch (this._HTMLElementTag) {
      case "input":
      case "textarea":
        let value: string;
        regexArr.forEach(([name, regex]) => {
          switch (name) {
            case "iban":
              value = this._value.replaceAll(" ", "");
              break;
            default:
              value = this._value.trim();
          }
          if (!regex.test(value)) valid = false;
        });
        break;
      case "select":
        const requiredOption = this._regexObject.requiredOption;
        if (requiredOption)
          for (const option of this._options)
            if (requiredOption.test(option.value) && !option.selected)
              valid = false;
        break;
      case "checkbox":
        const required = this._regexObject.required;
        if (required.test("required") && !(this._element as any).checked)
          valid = false;
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
    return this._value;
  }

  /**
   * @returns boolean
   */
  public get valid(): boolean {
    return this._valid;
  }

  /**
   * @param  {supportedElementTypes} element
   */
  public set _DOMElement(element: supportedElementTypes) {
    this._element = element;
    if (this._HTMLElementTag === "select") {
      const options = this._element.children;
      if (options.length < 1)
        throw `Please add at least one option to select ${this._name}!`;
      this._options = (options as unknown) as HTMLOptionElement[];
    }
    this.addListeners();
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
  protected supportedElementTags = ["input", "textarea", "select"];

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
      if (!this.supportedElementTags.includes(tag))
        throw "Unsupported HTMLElement!";

      element = document.querySelector(
        `${tag}[formControl="${control.name}"]`
      ) as HTMLElement;
      if (!element)
        throw `Couldn't find <${tag}> with formControl="${control.name}"!`;
      control._DOMElement = element as any;
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
      control.udpateValueAndValidity();
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
   * @returns FormControl
   */
  public get FormControls(): FormControl[] {
    return Object.entries(this._controls).map(
      (entry) => (entry[1] as unknown) as FormControl
    );
  }
}
