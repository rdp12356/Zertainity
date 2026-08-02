const fs = require('fs');
let code = fs.readFileSync('src/pages/Results.tsx', 'utf8');

const targetStr = `                  <div className="grid gap-3 md:grid-cols-2">
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
                  </div>`;

const replaceStr = `                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Best Colleges Nearby</h4>
                      <ul className="space-y-1 ml-5">
                        {(rec.topColleges || []).map((college) => (
                          <li key={college} className="text-sm text-muted-foreground list-disc">{college}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Recommended Courses</h4>
                      <ul className="space-y-1 ml-5">
                        {(rec.recommendedCourses || []).map((course) => (
                          <li key={course} className="text-sm text-muted-foreground list-disc">{course}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Suggested subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.suggestedSubjects.map((subject) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4 flex flex-col justify-between items-start">
                      <div>
                        <h4 className="font-semibold mb-2">Official pathway basis</h4>
                        <ul className="space-y-1 ml-5 mb-4">
                          {rec.officialPathways.slice(0, 2).map((pathway) => (
                            <li key={pathway} className="text-sm text-muted-foreground list-disc">{pathway}</li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        variant="default"
                        size="sm"
                        className="mt-2 w-full gap-2"
                        onClick={() => navigate(\`/careers/\${rec.stream.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`)}
                      >
                        View Career Roadmap <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('src/pages/Results.tsx', code);
  console.log('Updated Results.tsx successfully.');
} else {
  console.error('Target string not found in Results.tsx.');
}
