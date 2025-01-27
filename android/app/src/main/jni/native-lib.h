#ifndef NATIVE_LIB_H
#define NATIVE_LIB_H

extern "C" JNIEXPORT jstring JNICALL
Java_com_yourpackage_name_MainActivity_stringFromJNI(JNIEnv* env, jobject thiz);

#endif // NATIVE_LIB_H