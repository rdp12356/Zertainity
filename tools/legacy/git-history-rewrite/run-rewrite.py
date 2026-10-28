import subprocess
import os

exe = os.path.join(
    os.environ["APPDATA"],
    "Python",
    "Python314t",
    "Scripts",
    "git-filter-repo.exe"
)

callback = '''
if commit.author_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.author_name = b"Johan Manoj"
    commit.author_email = b"rdp12356@outlook.com"

if commit.committer_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.committer_name = b"Johan Manoj"
    commit.committer_email = b"rdp12356@outlook.com"
'''

print("Using:", exe)
print("Exists:", os.path.exists(exe))

subprocess.run([
    exe,
    "--force",
    "--refs", "refs/heads/ui-revamp",
    "--commit-callback", callback
], check=True)
