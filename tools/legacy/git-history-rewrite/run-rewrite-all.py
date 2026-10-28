import os
import subprocess

exe = os.path.join(
    os.environ["APPDATA"],
    "Python",
    "Python314t",
    "Scripts",
    "git-filter-repo.exe",
)

callback = r'''
name = b"Johan Manoj"
email = b"rdp12356@outlook.com"

if commit.author_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.author_name = name
    commit.author_email = email

if commit.committer_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.committer_name = name
    commit.committer_email = email

# Remove old Dependabot co-author trailers.
commit.message = commit.message.replace(
    b"\nCo-authored-by: dependabot[bot] <49699333+dependabot[bot]@users.noreply.github.com>",
    b""
)

# Remove old Dependabot signed-off-by lines.
commit.message = commit.message.replace(
    b"\nSigned-off-by: dependabot[bot] <support@github.com>",
    b""
)
'''

branches = subprocess.check_output(
    ["git", "for-each-ref", "--format=%(refname)", "refs/heads/"],
    text=True
).splitlines()

exclude = {
    "refs/heads/before-author-rewrite",
    "refs/heads/before-dependabot-cleanup",
}

refs = [b for b in branches if b not in exclude]

print("Branches to rewrite:")
for ref in refs:
    print(" ", ref)

cmd = [
    exe,
    "--force",
    "--refs",
    *refs,
    "--commit-callback",
    callback,
]

subprocess.run(cmd, check=True)
