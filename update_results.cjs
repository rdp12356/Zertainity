const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'pages', 'Results.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add board to ResultsLocationState
content = content.replace(
    /customAnswers\?: Record<number, string>;\n\};/g,
    'customAnswers?: Record<number, string>;\n  board?: string;\n};'
);

// 2. Add board to destructured state
content = content.replace(
    /marks,\n  \} = state;/g,
    'marks,\n    board,\n  } = state;'
);

// 3. Pass board to buildMarksFromSubjectRows
content = content.replace(
    /const academicMarks = buildMarksFromSubjectRows\(subjectRows\);/g,
    'const academicMarks = buildMarksFromSubjectRows(subjectRows, board);'
);

// 4. Update the career card to include courses, top colleges, and the button
const updatedCardGrid = `
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Suggested subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.suggestedSubjects.map((subject) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Official pathway basis</h4>
                      <ul className="space-y-1 ml-5">
                        {rec.officialPathways.slice(0, 2).map((pathway) => (
                          <li key={pathway} className="text-sm text-muted-foreground list-disc">{pathway}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Recommended Courses</h4>
                      <ul className="space-y-1 ml-5">
                        {rec.courses?.slice(0, 3).map((course, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground list-disc">{course}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Top Colleges</h4>
                      <ul className="space-y-1 ml-5">
                        {rec.topColleges?.slice(0, 4).map((college, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground list-disc">{college}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      className="gap-2" 
                      onClick={() => navigate('/pathways')}
                    >
                      Know more on Career Roadmaps <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
`;

content = content.replace(
    /<div className="grid gap-3 md:grid-cols-2">[\s\S]*?<\/ul>\n\s+<\/div>\n\s+<\/div>/g,
    updatedCardGrid.trim()
);

fs.writeFileSync(file, content);
console.log('Updated Results.tsx');
