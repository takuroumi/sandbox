# rev = [8 4 4 ; 14 12 13 ; 11 7 9];

rev11 = 8;
rev12 = 4;
rev13 = 4;
rev21 = 14;
rev22 = 12;
rev23 = 13;
rev31 = 11;
rev32 = 7;
rev33 = 9;

# 8 x11 + 4 x12 + 4 x13 + 14 x21 + 12 x22 + 13 x23 + 11 x31 + 7 x32 + 9 x33 = Z


x11 + x12 + x13 = 480;
x21 + x22 + x23 = 400;
x31 + x32 + x33 = 230;

x12 + x22 + x32 <= 420;
x13 + x23 + x33 <= 250;

x11

# blocks = [ x11 x12 x13 ; x21 x22 x23 ; x31 x32 x33];

# typeof(rev);

# totalRev = rev.*blocks;