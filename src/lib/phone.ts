const DIGIT_REGEX = /\D/g;

/**
 * Extract only numeric characters from a phone input.
 */
export function getPhoneDigits(value?: string | number | null) {
  if (value === undefined || value === null) {
    return "";
  }

  const raw = typeof value === "number" ? value.toString() : value;
  return raw.replace(DIGIT_REGEX, "");
}

/**
 * Formats a phone number into a readable Brazilian-style mask:
 * "XX XXXXX-XXXX" for mobile numbers or "XX XXXX-XXXX" for landlines.
 * Handles partial input so it can be used while the user is typing.
 */
export function formatPhone(value?: string | number | null) {
  const digits = getPhoneDigits(value).slice(0, 11);

  if (!digits) {
    return "";
  }

  const area = digits.slice(0, 2);
  const isMobile = digits.length > 10;
  const middle = isMobile ? digits.slice(2, 7) : digits.slice(2, 6);
  const last = isMobile ? digits.slice(7, 11) : digits.slice(6, 10);

  let formatted = area;

  if (middle) {
    formatted = formatted ? `${formatted} ${middle}` : middle;
  }

  if (last) {
    formatted = `${formatted}-${last}`;
  }

  return formatted.trim();
}
