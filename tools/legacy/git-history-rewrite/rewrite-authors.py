name = b"Johan" + bytes([32]) + b"Manoj"
if commit.author_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.author_name = name
    commit.author_email = b"rdp12356@outlook.com"
if commit.committer_email == b"49699333+dependabot[bot]@users.noreply.github.com":
    commit.committer_name = name
    commit.committer_email = b"rdp12356@outlook.com"
