export function dateToOpenSpaceTimeString(date: Date): string {
  // Spice, that is handling the time parsing in OpenSpace does not support
  // ISO 8601-style time zones (the Z). It does, however, always assume that UTC
  // is given.

  const year = date.getFullYear();
  
  // Spice assumes that years between 0-68 are abbreviation of 2000-2068 and 69-99 are 
  // abbreviation of 1969-1999, we assume people mean the actual year so we send the date
  // with an epoch as well. see: https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/str2et_c.html
  // for further details
  if(year >= 0 && year < 100) {
    const [utcYear, month, rest] = date.toJSON().replace('Z','').split('-')
    // With the format YYYY A.D. MM DD HH:MM:SS we can't have the 'T' token
    const [day, time] = rest.split('T');
    return `${utcYear} A.D. ${month} ${day} ${time}`
  }

  // For negative years we have to parse the string in B.C. epoch format for spice
  // see: https://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/cspice/str2et_c.html
  if(year < 0) {
    // Convert date to UTC time and replace Z as always, we also remove the preceding '-'
    // since we set the date using B.C epoch
    const utcDate = date.toJSON().replace('Z','').substring(1)
    const [utcYear, month, rest] = utcDate.split('-')
    // With the format YYYY B.C. MM DD HH:MM:SS we can't have the 'T' token
    const [day, time] = rest.split('T');

    return `${utcYear} B.C. ${month} ${day} ${time}`

  }

  // For years > 10 000 the JSON string includes a '+' which mess up the OpenSpace
  // interpretation of the value so we remove it here
  return date.toJSON().replace('Z', '').replace('+', '');
}
