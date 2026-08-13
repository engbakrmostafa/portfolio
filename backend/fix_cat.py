import sqlite3

conn = sqlite3.connect('db.sqlite3')
conn.execute("PRAGMA foreign_keys=OFF")
# Wipe all old projects so migration has nothing to violate
conn.execute("DELETE FROM portfolio_project")
conn.execute("DELETE FROM portfolio_projectimage")
conn.commit()
conn.close()
print("Done — old projects cleared, migration can now run cleanly")
