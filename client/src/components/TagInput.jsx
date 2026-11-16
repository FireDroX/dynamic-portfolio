import { useId, useRef, useState } from "react";
import "./styles/ContributorsInput.css";

// Generic tag input: typing a value then a commit key (or pasting a list)
// freezes the text into a tag. `name` mirrors the list into a hidden field so
// the value travels with a regular FormData submission.
const TagInput = ({
  value,
  onChange,
  name,
  normalize,
  validate,
  max,
  separators,
  commitKeys,
  suggestions,
  renderTag,
  label,
  placeholder,
  help,
  invalidMessage,
  limitMessage,
  removeLabel,
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const addItems = (text) => {
    const candidates = text.split(separators).filter(Boolean);
    if (!candidates.length) return true;

    const next = [...value];
    const seen = new Set(next.map((item) => item.toLowerCase()));
    const invalid = [];

    for (const candidate of candidates) {
      const item = normalize(candidate);
      if (!item) continue;
      if (!validate(item)) {
        invalid.push(candidate);
        continue;
      }
      if (seen.has(item.toLowerCase())) continue;
      if (next.length >= max) {
        setError(limitMessage);
        break;
      }
      seen.add(item.toLowerCase());
      next.push(item);
    }

    if (next.length !== value.length) onChange(next);

    if (invalid.length) {
      setDraft(invalid.join(" "));
      setError(invalidMessage(invalid[0]));
      return false;
    }

    setDraft("");
    if (next.length < max) setError("");
    return true;
  };

  const removeItem = (item) => {
    onChange(value.filter((current) => current !== item));
    setError("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (commitKeys.includes(event.key)) {
      event.preventDefault();
      addItems(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && value.length) {
      event.preventDefault();
      removeItem(value[value.length - 1]);
    }
  };

  const handleChange = (event) => {
    const text = event.target.value;
    // Pasted lists are split right away; the last part stays editable unless
    // it is followed by a separator.
    if (separators.test(text)) {
      const parts = text.split(separators);
      const rest = parts.pop();
      if (addItems(parts.join("\n"))) setDraft(rest);
      return;
    }

    setDraft(text);
    if (error) setError("");
  };

  const listId = `${inputId}-list`;
  const taken = new Set(value.map((item) => item.toLowerCase()));
  const options = suggestions?.filter((item) => !taken.has(item.toLowerCase()));

  return (
    <div className="panel-field contributors-field">
      <label htmlFor={inputId}>{label}</label>
      <div
        className={`contributors-input${error ? " has-error" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) inputRef.current?.focus();
        }}
      >
        {value.map((item) => (
          <span className="contributor-tag" key={item}>
            {renderTag(item)}
            <button
              type="button"
              onClick={() => removeItem(item)}
              aria-label={removeLabel(item)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => addItems(draft)}
          placeholder={value.length ? "" : placeholder}
          autoComplete="off"
          spellCheck="false"
          list={options ? listId : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={`${inputId}-help`}
        />
        {options && (
          <datalist id={listId}>
            {options.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        )}
      </div>
      <small id={`${inputId}-help`} className="contributors-help" role="status">
        {error || help}
      </small>
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}
    </div>
  );
};

export default TagInput;
