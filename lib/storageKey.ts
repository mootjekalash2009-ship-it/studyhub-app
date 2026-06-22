export const makeKey = (subject: string, folder?: string) => {
  const safeSubject = subject.toLowerCase().trim().replace(/\s+/g, "-");

  if (!folder) {
    return `studyhub_folders_${safeSubject}`;
  }

  const safeFolder = folder.toLowerCase().trim().replace(/\s+/g, "-");

  return `studyhub_cards_${safeSubject}_${safeFolder}`;
};