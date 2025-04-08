# react-dntel-form

A react package which exports a form hook called useDntelForm which has an example use of something like this [demo](https://dntel-form-demo.vercel.app)

---

## Installation

### Using npm:

```bash
npm install react-dntel-form
```

---

## Example Usage

```ts
const {
  FormComponent,
  changes,
  activeSection,
  expandedSections,
  lastChanged,
  expandAll,
  collapseAll,
  scrollToSection,
  expandSection,
  editMode,
  setEditMode
} = useDntelForm(initialData: any, id?: string)

```
