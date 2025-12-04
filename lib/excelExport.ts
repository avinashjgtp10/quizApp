import * as XLSX from 'xlsx';
import { questions } from '@/app/quiz/page';

interface QuizSubmission {
  id?: string;
  [key: string]: any;
}

export const exportToExcel = (submissions: QuizSubmission[]) => {
  if (submissions.length === 0) {
    alert('No data to export!');
    return;
  }

  // Create a mapping of question IDs to their questions
  const questionMap: Record<number, string> = {};
  questions.forEach((q) => {
    questionMap[q.id] = q.question;
  });

  // Prepare data for Excel
  const exportData = submissions.map((submission, index) => {
    const row: Record<string, any> = {
      'S.No': index + 1,
    };

    // Add all question answers
    Object.entries(submission).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'timestamp') {
        const questionId = parseInt(key);
        const questionText = questionMap[questionId] || `Question ${questionId}`;
        
        // Format checkbox answers (arrays) as comma-separated values
        if (Array.isArray(value)) {
          row[questionText] = value.join(', ');
        } else {
          row[questionText] = value;
        }
      }
    });

    // Add timestamp if available
    if (submission.timestamp) {
      row['Submitted At'] = new Date(submission.timestamp).toLocaleString();
    }

    return row;
  });

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths for better readability
  const colWidths = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz Submissions');

  // Generate Excel file
  XLSX.writeFile(wb, `quiz_submissions_${new Date().getTime()}.xlsx`);
};
