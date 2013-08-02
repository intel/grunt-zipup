This is to test zip file corruption with adm-zip.

Note that because the bug isn't at the point of read, but at the
point of extraction, the associated test attempts to unpack the file
as well as read its content list.
